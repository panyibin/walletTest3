//
//  PinInputCollectionViewCell.m
//  NumKeyboardTest
//
//  Created by PanYibin on 2018/3/28.
//  Copyright © 2018年 PanYibin. All rights reserved.
//

#import "PinInputCollectionViewCell.h"
#import <Masonry.h>

@interface PinInputCollectionViewCell ()

@property (nonatomic, strong) UILabel *numberLabel;
@property (nonatomic, strong) UIImageView *imageView;

@end

@implementation PinInputCollectionViewCell

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        [self.contentView addSubview:self.highlightView];
        [self.contentView addSubview:self.numberLabel];
        [self.contentView addSubview:self.imageView];
        
        [self configLayout];
    }
    
    return self;
}

- (void)configLayout {
    [self.numberLabel mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.edges.mas_equalTo(self.contentView);
    }];
    
    [self.imageView mas_remakeConstraints:^(MASConstraintMaker *make) {
//        make.edges.mas_equalTo(self.contentView);
        make.center.mas_equalTo(self.contentView);
        make.width.mas_equalTo(35);
        make.height.mas_equalTo(35);
    }];
    
    CGFloat highlightViewWidth = 60;
    
    [self.highlightView mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.center.mas_equalTo(self.contentView);
        make.width.mas_equalTo(highlightViewWidth);
        make.height.mas_equalTo(highlightViewWidth);
    }];
    
    self.highlightView.layer.cornerRadius = highlightViewWidth/2;
}

- (UILabel *)numberLabel {
    if (!_numberLabel) {
        _numberLabel = [[UILabel alloc] init];
        _numberLabel.font = [UIFont systemFontOfSize:35 weight:UIFontWeightBold];
        _numberLabel.textAlignment = NSTextAlignmentCenter;
        _numberLabel.textColor = [UIColor whiteColor];
    }
    
    return _numberLabel;
}

- (UIImageView *)imageView {
    if (!_imageView) {
        _imageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"delete"]];
        _imageView.contentMode = UIViewContentModeScaleAspectFit;
    }
    
    return _imageView;
}

- (UIView *)highlightView {
    if (!_highlightView) {
        _highlightView = [[UIView alloc] init];
        _highlightView.backgroundColor = [UIColor clearColor];
        _highlightView.clipsToBounds = YES;
    }
    
    return _highlightView;
}

- (void)setNumber:(NSInteger)number {
    _number = number;
    self.numberLabel.text = [NSString stringWithFormat:@"%ld", number];
}

- (void)setCellType:(PinInputCollectionViewCellType)cellType {
    _cellType = cellType;
    if (cellType == PinInputCollectionViewCellTypeEmpty) {
        self.numberLabel.hidden = YES;
        self.imageView.hidden = YES;
        self.highlightView.hidden = YES;
    } else if (cellType == PinInputCollectionViewCellTypeNumber) {
        self.numberLabel.hidden = NO;
        self.imageView.hidden = YES;
        self.highlightView.hidden = NO;
    } else {
        self.numberLabel.hidden = YES;
        self.imageView.hidden = NO;
        self.highlightView.hidden = YES;
    }
}

@end
