//
//  PinInputViewController.h
//  NumKeyboardTest
//
//  Created by PanYibin on 2018/3/28.
//  Copyright © 2018年 PanYibin. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface PinInputViewController : UIViewController<UICollectionViewDataSource, UICollectionViewDelegate, UICollectionViewDelegateFlowLayout>

@property (nonatomic, assign) BOOL hasCloseButton;
@property (nonatomic, copy) void(^pinCodeVerifiedBlock)(void);

+ (instancetype)sharedInstance;
//- (void)showWithCloseButton:(BOOL)bCloseButton animated:(BOOL)animated;

@end
