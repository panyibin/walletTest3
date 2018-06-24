//
//  PinInputViewController.m
//  NumKeyboardTest
//
//  Created by PanYibin on 2018/3/28.
//  Copyright © 2018年 PanYibin. All rights reserved.
//

#import "PinInputViewController.h"
#import <Masonry.h>
#import "PinInputCollectionViewCell.h"
#import "PinDotCollectionViewCell.h"

static NSString *kPinInputCollectionViewCellIdentifier = @"kPinInputCollectionViewCellIdentifier";
static NSString *kPinDotCollectionViewCellIdentifier = @"kPinDotCollectionViewCellIdentifier";

#define kPinCodeCount 6

#define kPinInputZeroIndex 10
#define kPinInputEmptyCellIndex 9
#define kPinInputDeleteButtonIndex 11

#define kPinInputCollectionViewWidth 300
#define kPinInputCollectionViewHeight 400

#define kDotCollectionViewWidth 200
#define kDotCollectionViewHeight 15

@interface PinInputViewController ()
{
  NSInteger remainingInputTimes;
}

@property (nonatomic, strong) NSMutableArray *inputPinNumArray;//the content is NSString

@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, strong) UIButton *closeButton;
@property (nonatomic, strong) UICollectionView *numberCollectionView;
@property (nonatomic, strong) UICollectionView *dotCollectionView;

@end

@implementation PinInputViewController

+ (void)load {
  [SVProgressHUD setMinimumDismissTimeInterval:1];
}

+ (instancetype)sharedInstance {
  static PinInputViewController *_instance;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    _instance = [[PinInputViewController alloc] init];
  });
  
  return _instance;
}

//+ (void)showWithCloseButton:(BOOL)bCloseButton animated:(BOOL)animated {
//
//  [[NavigationHelper sharedInstance].rootNavigationController presentViewController:[PinInputViewController sharedInstance] animated:YES completion:^{
//    
//  }];
//  
//  [PinInputViewController sharedInstance].closeButton.hidden = !bCloseButton;
//}
//- (void)showWithCloseButton:(BOOL)bCloseButton animated:(BOOL)animated {
//  self.hasCloseButton = bCloseButton;
//  [[NavigationHelper sharedInstance].rootNavigationController presentViewController:self animated:animated completion:nil];
//}

- (void)viewDidLoad {
  [super viewDidLoad];
  
  remainingInputTimes = 3;
  
  self.view.backgroundColor = [UIColor colorWithRed:32/255.0 green:124/255.0 blue:247/255.0 alpha:1];
  self.inputPinNumArray = [[NSMutableArray alloc] init];
  
  self.titleLabel.text = @"Input your pin code";
  
  
  @weakify(self)
  [[self.closeButton rac_signalForControlEvents:UIControlEventTouchUpInside] subscribeNext:^(__kindof UIControl * _Nullable x) {
    @strongify(self)
    [self dismissViewControllerAnimated:YES completion:nil];
  }];
  
  [self.titleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
    make.top.mas_equalTo(self.view).offset(60);
    make.centerX.mas_equalTo(self.view);
  }];
  
  [self.closeButton mas_makeConstraints:^(MASConstraintMaker *make) {
    make.top.mas_equalTo(self.view).offset(44);
    make.right.mas_equalTo(self.view).offset(-15);
    make.width.mas_equalTo(20);
    make.height.mas_equalTo(20);
  }];
  
  [self.numberCollectionView mas_makeConstraints:^(MASConstraintMaker *make) {
//    make.bottom.mas_equalTo(-30);
    make.centerY.mas_equalTo(self.view).offset(50);
    make.centerX.mas_equalTo(self.view);
    make.width.mas_equalTo(kPinInputCollectionViewWidth);
    make.height.mas_equalTo(kPinInputCollectionViewHeight);
  }];
  
  //    self.dotCollectionView.backgroundColor = [UIColor redColor];
  [self.dotCollectionView mas_makeConstraints:^(MASConstraintMaker *make) {
    if ([SWUtils getScreenType] == ScreenTypeiPhoneSmall) {
      make.bottom.mas_equalTo(self.numberCollectionView.mas_top).offset(-20);
    } else {
      make.bottom.mas_equalTo(self.numberCollectionView.mas_top).offset(-50);
    }
    
    make.centerX.mas_equalTo(self.view);
    make.width.mas_equalTo(kDotCollectionViewWidth);
    make.height.mas_equalTo(kDotCollectionViewHeight);
  }];
}

- (void)viewWillAppear:(BOOL)animated {

  self.closeButton.hidden = self.hasCloseButton ? NO : YES;
  
  [self resetInputStatus];
}

#pragma properties initialize
-(UILabel *)titleLabel {
    if (!_titleLabel) {
        _titleLabel = [[UILabel alloc] init];
        _titleLabel.textColor = [UIColor whiteColor];
        _titleLabel.font = [UIFont systemFontOfSize:23 weight:UIFontWeightRegular];
        _titleLabel.textAlignment = NSTextAlignmentCenter;
        
        [self.view addSubview:_titleLabel];
    }
    
    return _titleLabel;
}

- (UIButton *)closeButton {
  if (!_closeButton) {
    _closeButton = [[UIButton alloc] init];
    [self.view addSubview:_closeButton];
    UIImage *image = [UIImage imageNamed:@"close"];
    [_closeButton setImage:image forState:UIControlStateNormal];
  }
  
  return _closeButton;
}

-(UICollectionView *)numberCollectionView {
    if (!_numberCollectionView) {
        UICollectionViewFlowLayout *layout = [[UICollectionViewFlowLayout alloc] init];
        _numberCollectionView = [[UICollectionView alloc] initWithFrame:CGRectZero collectionViewLayout:layout];
        _numberCollectionView.backgroundColor = [UIColor clearColor];
        [self.view addSubview:_numberCollectionView];
        [_numberCollectionView registerClass:[PinInputCollectionViewCell class] forCellWithReuseIdentifier:kPinInputCollectionViewCellIdentifier];
        _numberCollectionView.dataSource = self;
        _numberCollectionView.delegate = self;
    }
    
    return _numberCollectionView;
}

- (UICollectionView *)dotCollectionView {
    if (!_dotCollectionView) {
        UICollectionViewFlowLayout *layout = [[UICollectionViewFlowLayout alloc] init];
        _dotCollectionView = [[UICollectionView alloc] initWithFrame:CGRectZero collectionViewLayout:layout];
        _dotCollectionView.backgroundColor = [UIColor clearColor];
        [self.view addSubview:_dotCollectionView];
        [_dotCollectionView registerClass:[PinDotCollectionViewCell class] forCellWithReuseIdentifier:kPinDotCollectionViewCellIdentifier];
        _dotCollectionView.dataSource = self;
        _dotCollectionView.delegate = self;
    }
    
    return _dotCollectionView;
}

#pragma common method
- (void)handleInputPinCodeChange {
  
  [self hightlightDotWithCount:self.inputPinNumArray.count];
  
  if (self.inputPinNumArray.count == kPinCodeCount) {
    //handle input result
    [self handlePinCodeResult];
  }
}

- (void)handlePinCodeResult {
  //5 minutes check
  NSTimeInterval lastFailureTime = [[NSUserDefaults standardUserDefaults] doubleForKey:kLastPinCodeFailureTime];
  NSTimeInterval currentTime = [[NSDate date] timeIntervalSince1970];
  
  NSTimeInterval retryTimeInterval = 60 * 5;//try again 5 minutes later
  
  if (currentTime - lastFailureTime < retryTimeInterval) {
    NSInteger remainingTime = retryTimeInterval - (currentTime - lastFailureTime);
    if (remainingTime >= 60) {
      NSInteger remainingMinutes = remainingTime / 60;
      [SVProgressHUD showErrorWithStatus:[NSString stringWithFormat:@"try again %ld minute(s) later", remainingMinutes]];
    } else {
      [SVProgressHUD showErrorWithStatus:[NSString stringWithFormat:@"try again %ld seconds later", remainingTime]];
    }
    
    [self resetInputStatus];
    
    return;
  } else {
    if (remainingInputTimes <= 0) {
      remainingInputTimes = 3;
    }
  }
  
  NSString *userPinCode = [[NSUserDefaults standardUserDefaults] stringForKey:kPinCode];
  
  NSMutableString *inputPinCode = [[NSMutableString alloc] init];
  for (NSString *str in self.inputPinNumArray) {
    [inputPinCode appendString:str];
  }
  
  if ([inputPinCode isEqualToString:userPinCode]) {
    [self dismissViewControllerAnimated:YES completion:nil];
    if(self.pinCodeVerifiedBlock) {
      self.pinCodeVerifiedBlock();
    }
  } else {
    remainingInputTimes--;
    if (remainingInputTimes > 0) {
      [SVProgressHUD showErrorWithStatus:[NSString stringWithFormat:@"wrong pin code, %ld times remained", remainingInputTimes]];
    } else {
      [SVProgressHUD showErrorWithStatus:[NSString stringWithFormat:@"try again 5 minutes later"]];
      [[NSUserDefaults standardUserDefaults] setDouble:currentTime forKey:kLastPinCodeFailureTime];
    }
    
    [self resetInputStatus];
  }
}

- (void)resetInputStatus {
  [self hightlightDotWithCount:0];
  [self.inputPinNumArray removeAllObjects];
}

- (void)hightlightDotWithCount:(NSInteger)highlightCount {
  UIColor *dotColorNormal = [UIColor blackColor];
  UIColor *dotColorHighlight = [UIColor colorWithRed:253/255.0 green:192/255.0 blue:59/255.0 alpha:1];
  
  for (int i = 0; i < kPinCodeCount; i++) {
    PinDotCollectionViewCell *cell = (PinDotCollectionViewCell*)[self.dotCollectionView cellForItemAtIndexPath:[NSIndexPath indexPathForRow:i inSection:0]];
    if (i < highlightCount) {
      cell.dotView.backgroundColor = dotColorHighlight;
    } else {
      cell.dotView.backgroundColor = dotColorNormal;
    }
  }
}

#pragma collectionView delegate
- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    if (collectionView == self.numberCollectionView) {
        return 12;
    } else if (collectionView == self.dotCollectionView)
        return kPinCodeCount;
    else {
        return 0;
    }
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    
    if (collectionView == self.numberCollectionView) {
        PinInputCollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:kPinInputCollectionViewCellIdentifier forIndexPath:indexPath];
        
        if (indexPath.item >= 0 && indexPath.item <= 8) {
            cell.cellType = PinInputCollectionViewCellTypeNumber;
            cell.number = indexPath.item + 1;
        } else if (indexPath.item == kPinInputZeroIndex) {
            cell.cellType = PinInputCollectionViewCellTypeNumber;
            cell.number = 0;
        } else if (indexPath.item == kPinInputEmptyCellIndex) {
            cell.cellType = PinInputCollectionViewCellTypeEmpty;
        } else {
            cell.cellType = PinInputCollectionViewCellTypeBack;
        }
        
        return cell;
    } else if (collectionView == self.dotCollectionView) {
        PinDotCollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:kPinDotCollectionViewCellIdentifier forIndexPath:indexPath];
        
        cell.dotView.backgroundColor = [UIColor blackColor];
        
        return cell;
    } else {
        return nil;
    }
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath {
    if (collectionView == self.numberCollectionView) {
        CGFloat width = kPinInputCollectionViewWidth/3 - 10;
        CGFloat height = width;
        
        return CGSizeMake(width, height);
    } else if (collectionView == self.dotCollectionView) {
        CGFloat width = kDotCollectionViewWidth / kPinCodeCount - 10;
        CGFloat height = kDotCollectionViewHeight;
        
        return CGSizeMake(width, height);
    } else {
        return CGSizeZero;
    }
}

-(BOOL)collectionView:(UICollectionView *)collectionView shouldSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    if (collectionView == self.numberCollectionView) {
        if(indexPath.item == kPinInputEmptyCellIndex) {
            return NO;
        } else {
            return YES;
        }
    } else {
        return NO;
    }
}

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    if(collectionView == self.numberCollectionView) {
        NSLog(@"select %ld", indexPath.item);
        if (indexPath.item >= 0 && indexPath.item <= 8 ) {
            if (self.inputPinNumArray.count < kPinCodeCount) {
                NSString *currentNumStr = [NSString stringWithFormat:@"%ld", indexPath.item + 1];
                [self.inputPinNumArray addObject:currentNumStr];
            }
        } else if (indexPath.item == kPinInputZeroIndex) {
            if (self.inputPinNumArray.count < kPinCodeCount) {
                [self.inputPinNumArray addObject:@"0"];
            }
        } else {
            if (self.inputPinNumArray.count > 0) {
                [self.inputPinNumArray removeLastObject];
            }
        }
        
        [self handleInputPinCodeChange];
    }
}

- (void)collectionView:(UICollectionView *)collectionView didHighlightItemAtIndexPath:(NSIndexPath *)indexPath {
    
    if(collectionView == self.numberCollectionView) {
        if((indexPath.item >= 0 && indexPath.item <= 8) || indexPath.item == kPinInputZeroIndex) {
            PinInputCollectionViewCell *cell = (PinInputCollectionViewCell*)[collectionView cellForItemAtIndexPath:indexPath];
          
          [UIView animateWithDuration:0.1 animations:^{
            cell.highlightView.backgroundColor = [UIColor blackColor];
          } completion:^(BOOL finished) {
            [UIView animateWithDuration:0.1 animations:^{
              cell.highlightView.backgroundColor = [UIColor clearColor];
            }];
          }];
        }
    }
}

//- (void)collectionView:(UICollectionView *)collectionView didUnhighlightItemAtIndexPath:(NSIndexPath *)indexPath {
//    if (collectionView == self.numberCollectionView) {
//        if((indexPath.item >= 0 && indexPath.item <= 8) || indexPath.item == kPinInputZeroIndex) {
//            PinInputCollectionViewCell *cell = (PinInputCollectionViewCell*)[collectionView cellForItemAtIndexPath:indexPath];
//            
////            cell.highlightView.backgroundColor = [UIColor clearColor];
//        }
//    }
//}

- (void)loadView {
    UIView *view = [[UIView alloc] initWithFrame:[UIScreen mainScreen].bounds];
    view.backgroundColor = [UIColor whiteColor];
    
    self.view = view;
}

@end
